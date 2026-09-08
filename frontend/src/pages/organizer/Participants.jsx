import React from "react";

function Participants() {
  const participants = [
    {
      id: 1,
      name: "Aarav Patel",
      email: "aarav.patel@example.com",
      event: "Tech Innovation Summit",
      date: "10 Sep 2026",
      status: "Registered",
    },
    {
      id: 2,
      name: "Ananya Shah",
      email: "ananya.shah@example.com",
      event: "Tech Innovation Summit",
      date: "11 Sep 2026",
      status: "Registered",
    },
    {
      id: 3,
      name: "Rahul Mehta",
      email: "rahul.mehta@example.com",
      event: "Web Development Workshop",
      date: "12 Sep 2026",
      status: "Registered",
    },
    {
      id: 4,
      name: "Priya Desai",
      email: "priya.desai@example.com",
      event: "Coding Competition",
      date: "13 Sep 2026",
      status: "Registered",
    },
    {
      id: 5,
      name: "Rohan Joshi",
      email: "rohan.joshi@example.com",
      event: "Tech Innovation Summit",
      date: "14 Sep 2026",
      status: "Registered",
    },
  ];

  return (
    <div className="participants-page">
      <div className="participants-container">

        <div className="participants-header">
          <div>
            <h1>Participants</h1>
            <p>View students registered for your events.</p>
          </div>
        </div>

        <div className="participants-card">

          <div className="participants-card-header">
            <div>
              <h2>Participant List</h2>
              <p>{participants.length} participants registered</p>
            </div>
          </div>

          <div className="participants-table-wrapper">
            <table className="participants-table">
              <thead>
                <tr>
                  <th>Participant</th>
                  <th>Email</th>
                  <th>Event</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {participants.map((participant) => (
                  <tr key={participant.id}>

                    <td>
                      <div className="participant-name">
                        <div className="participant-avatar">
                          {participant.name.charAt(0)}
                        </div>

                        <strong>{participant.name}</strong>
                      </div>
                    </td>

                    <td>{participant.email}</td>

                    <td>{participant.event}</td>

                    <td>{participant.date}</td>

                    <td>
                      <span className="participant-status">
                        {participant.status}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Participants;