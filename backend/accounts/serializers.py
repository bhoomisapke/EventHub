from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'name',
            'email',
            'password',
            'role',
            'phone',
            'student_id',
            'department',
            'year',
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            role=validated_data['role'],
            phone=validated_data.get('phone', ''),
            student_id=validated_data.get('student_id', ''),
            department=validated_data.get('department', ''),
            year=validated_data.get('year'),
        )

        return user
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "email",
            "role",
            "phone",
            "student_id",
            "department",
            "year",
        ]

        read_only_fields = [
            "id",
            "email",
            "role",
        ]