import React from 'react';
import '../styles/aboutUs.css'; 

import victorIMG from "../assets/images/victor.jpeg"
import vishalIMG from "../assets/images/vishal.JPG"
import shagunIMG from "../assets/images/shagun.jpeg"
import mohammedIMG from "../assets/images/mohammad.jpeg"
import leelaIMG from "../assets/images/sai teja.jpeg"

const teamMembers = [
  {
    name: "Shagun Sharma",
    department: "Computer Science",
    email: "shagun.sharma@slu.edu",
    photo: shagunIMG
  },
  {
    name: "Victor Ojogbane Onoja",
    department: "Computer Science",
    email: "victor.onoja@slu.edu",
    photo: victorIMG
  },
  {
    name: "Mohammad Al-Hanoosh",
    department: "Computer Science",
    email: "mohammad.alhanoosh@slu.edu",
    photo: mohammedIMG
  },
  {
    name: "Vishal Reddy Putta",
    department: "Computer Science",
    email: "vishalreddy.putta@slu.edu",
    photo: vishalIMG
  },
  {
    name: "Leela Phanidhar Sai Teja Nalanagula",
    department: "Computer Science",
    email: "leelaphanidharsaiteja.nalanagula@slu.edu",
    photo: leelaIMG
  }
]

const AboutUs = () => {
    return (
        <div className="about-us-container">
            <h1 className="about-us-title">About SLUReuse</h1>
            <p className="about-us-intro">
                At SLUReuse, we connect generous donors with the SLU student community to promote sustainability and resource sharing.
            </p>
            
            {/* Vision Section */}
            <section className="about-us-section">
                <h2>Vision</h2>
                <p>Our vision is to create a community where every student at SLU can easily share and access surplus items, fostering a culture of generosity and sustainability.</p>
            </section>

            {/* Mission Section */}
            <section className="about-us-section">
                <h2>Mission</h2>
                <p>Our mission is to facilitate the donation and redistribution of items among students, helping reduce waste and promote a sustainable campus environment.</p>
            </section>

            {/* About Team Section */}
            <section className="about-us-section">
                <h2>About Our Team</h2>
                <div className="team-grid">
                    {teamMembers.map((member, index) => (
                        <div className="team-member" key={index}>
                            <img src={member.photo} alt={`${member.name}'s photo`} className="team-photo" />
                            <h3>{member.name}</h3>
                            <p>{member.department}</p>
                            <p>Email: <a href={`mailto:${member.email}`}>{member.email}</a></p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Participating as a Donor Section */}
            <section className="about-us-section">
                <h2>Participating as a Donor</h2>
                <p>As a donor, you can help reduce waste by giving your surplus items a new home. Whether it’s clothing, furniture, or electronics, your contributions make a difference!</p>
            </section>

            {/* Participating as a Recipient Section */}
            <section className="about-us-section">
                <h2>Participating as a Recipient</h2>
                <p>As a recipient, you can browse available items and claim what you need. SLUReuse helps you connect with fellow students while promoting sustainability.</p>
            </section>

            <footer className="about-us-footer">
                <p>Join us in our mission to support sustainability and community spirit at SLU!</p>
            </footer>
        </div>
    );
};

export default AboutUs;
