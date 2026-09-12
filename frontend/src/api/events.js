const API_URL =
  "http://127.0.0.1:8000/api/events/";


const getToken = () => {

  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );

};


/* ==========================================================
   GET ALL PUBLISHED EVENTS
   ========================================================== */

export const getEvents = async () => {

  const response =
    await fetch(API_URL);


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(
      data?.detail ||
      "Failed to load events."
    );

  }


  return Array.isArray(data)
    ? data
    : data.results || [];

};


/* ==========================================================
   GET ORGANIZER'S EVENTS
   ========================================================== */

export const getMyEvents = async () => {

  const token =
    getToken();


  if (!token) {
    throw new Error(
      "Please login as organizer."
    );
  }


  const response =
    await fetch(
      `${API_URL}my/`,
      {
        headers: {
          Authorization:
            `Token ${token}`,
        },
      }
    );


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(
      data?.detail ||
      "Failed to load your events."
    );

  }


  return data;

};


/* ==========================================================
   CREATE EVENT
   ========================================================== */

export const createEvent = async (
  eventData
) => {

  const token =
    getToken();


  if (!token) {

    throw new Error(
      "Please login as organizer."
    );

  }


  const formData =
    new FormData();


  formData.append(
    "title",
    eventData.title
  );

  formData.append(
    "description",
    eventData.description
  );

  formData.append(
    "category",
    eventData.category
  );

  formData.append(
    "date",
    eventData.date
  );

  formData.append(
    "time",
    eventData.time
  );

  formData.append(
    "venue",
    eventData.venue
  );

  formData.append(
    "capacity",
    eventData.capacity
  );

  formData.append(
    "registration_deadline",
    eventData.registration_deadline
  );

  formData.append(
    "status",
    eventData.status || "published"
  );


  if (eventData.image) {

    formData.append(
      "image",
      eventData.image
    );

  }


  const response =
    await fetch(
      API_URL,
      {
        method: "POST",

        headers: {
          Authorization:
            `Token ${token}`,
        },

        body: formData,
      }
    );


  const data =
    await response.json();


  if (!response.ok) {

    console.error(
      "Create event error:",
      data
    );


    let message =
      "Failed to create event.";


    if (data.detail) {

      message =
        data.detail;

    } else {

      const errors =
        Object.values(data)
          .flat()
          .filter(Boolean);


      if (errors.length > 0) {
        message =
          errors.join(" ");
      }

    }


    throw new Error(
      message
    );

  }


  return data;

};


/* ==========================================================
   UPDATE EVENT
   ========================================================== */

export const updateEvent = async (
  id,
  eventData
) => {

  const token =
    getToken();


  if (!token) {

    throw new Error(
      "Please login as organizer."
    );

  }


  const formData =
    new FormData();


  formData.append(
    "title",
    eventData.title
  );

  formData.append(
    "description",
    eventData.description
  );

  formData.append(
    "category",
    eventData.category
  );

  formData.append(
    "date",
    eventData.date
  );

  formData.append(
    "time",
    eventData.time
  );

  formData.append(
    "venue",
    eventData.venue
  );

  formData.append(
    "capacity",
    eventData.capacity
  );

  formData.append(
    "registration_deadline",
    eventData.registration_deadline
  );

  formData.append(
    "status",
    eventData.status || "published"
  );


  if (eventData.image) {

    formData.append(
      "image",
      eventData.image
    );

  }


  const response =
    await fetch(
      `${API_URL}${id}/`,
      {
        method: "PATCH",

        headers: {
          Authorization:
            `Token ${token}`,
        },

        body: formData,
      }
    );


  const data =
    await response.json();


  if (!response.ok) {

    throw new Error(
      data?.detail ||
      "Failed to update event."
    );

  }


  return data;

};


/* ==========================================================
   DELETE EVENT
   ========================================================== */

export const deleteEvent = async (
  id
) => {

  const token =
    getToken();


  if (!token) {

    throw new Error(
      "Please login as organizer."
    );

  }


  const response =
    await fetch(
      `${API_URL}${id}/`,
      {
        method: "DELETE",

        headers: {
          Authorization:
            `Token ${token}`,
        },
      }
    );


  if (!response.ok) {

    let data = {};

    try {
      data =
        await response.json();
    } catch {
      // No response body.
    }


    throw new Error(
      data?.detail ||
      "Failed to delete event."
    );

  }


  return true;

};