from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import RegisterSerializer


# ============================================================
# REGISTER
# ============================================================

class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    "message": "Account created successfully",
                    "user": {
                        "id": user.id,
                        "name": user.name,
                        "email": user.email,
                        "role": user.role,
                    }
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# ============================================================
# LOGIN
# ============================================================

class LoginView(APIView):

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {
                    "message": "Email and password are required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(
            request,
            username=email,
            password=password
        )

        if user is None:
            return Response(
                {
                    "message": "Invalid email or password"
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        token, created = Token.objects.get_or_create(user=user)

        return Response(
            {
                "message": "Login successful",
                "token": token.key,
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "role": user.role,
                }
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# LOGOUT
# ============================================================

class LogoutView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        if request.user.auth_token:
            request.user.auth_token.delete()

        return Response(
            {
                "message": "Logout successful"
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# CURRENT USER / ME
# ============================================================

class MeView(APIView):

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        return Response(
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "phone": user.phone,
                "student_id": user.student_id,
                "department": user.department,
                "year": user.year,
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# FORGOT PASSWORD
# ============================================================

class ForgotPasswordView(APIView):

    def post(self, request):

        email = request.data.get("email")

        # Check email
        if not email:
            return Response(
                {
                    "message": "Email is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find user
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {
                    "message": "No account found with this email"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Generate UID
        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        # Generate secure reset token
        token = default_token_generator.make_token(user)

        # Create reset link
        reset_link = (
            f"http://localhost:5173/reset-password/{uid}/{token}/"
        )

        # Send email
        send_mail(
            subject="EventHub Password Reset",

            message=f"""
Hello {user.name},

You requested to reset your EventHub password.

Use the following link to reset your password:

{reset_link}

If you did not request this password reset, you can safely ignore this email.

Thank you,
EventHub Team
""",

            from_email="noreply@eventhub.com",

            recipient_list=[user.email],

            fail_silently=False,
        )

        return Response(
            {
                "message": "Password reset link has been sent to your email"
            },
            status=status.HTTP_200_OK
        )


# ============================================================
# RESET PASSWORD
# ============================================================

class ResetPasswordView(APIView):

    def post(self, request):

        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        # Check required fields
        if not uid or not token or not new_password:
            return Response(
                {
                    "message": "UID, token and new password are required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check password length
        if len(new_password) < 8:
            return Response(
                {
                    "message": "Password must be at least 8 characters"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Decode UID and find user
        try:
            user_id = force_str(
                urlsafe_base64_decode(uid)
            )

            user = User.objects.get(pk=user_id)

        except (
            TypeError,
            ValueError,
            OverflowError,
            User.DoesNotExist
        ):
            return Response(
                {
                    "message": "Invalid reset link"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check token
        if not default_token_generator.check_token(
            user,
            token
        ):
            return Response(
                {
                    "message": "Invalid or expired reset link"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Set new password
        user.set_password(new_password)

        user.save()

        return Response(
            {
                "message": "Password reset successfully"
            },
            status=status.HTTP_200_OK
        )