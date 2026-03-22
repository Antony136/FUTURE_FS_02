import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Lead from "./models/Lead.js";
import User from "./models/User.js";

dotenv.config();

const names = [
  "Aarav Shah", "Priya Nair", "Rohan Mehta", "Sneha Iyer", "Kiran Patel",
  "Divya Reddy", "Arjun Sharma", "Meera Joshi", "Vikram Singh", "Ananya Das",
  "Rahul Gupta", "Pooja Verma", "Nikhil Rao", "Shreya Pillai", "Aditya Kumar",
  "Lakshmi Menon", "Siddharth Bose", "Kavya Nambiar", "Yash Malhotra", "Riya Desai",
  "Tarun Kapoor", "Swati Saxena", "Manish Tiwari", "Deepika Choudhary", "Harsh Pandey",
  "Nandini Krishnan", "Varun Jain", "Ishaan Chatterjee", "Preethi Suresh", "Akash Yadav",
  "Simran Kaur", "Rohit Nair", "Fatima Sheikh", "Gaurav Mishra", "Tanvi Bhatt",
  "Kartik Anand", "Ayesha Khan", "Suresh Pillai", "Bhavna Tomar", "Rajat Saxena",
  "Nisha Menon", "Dhruv Kapoor", "Pallavi Rao", "Saurabh Jha", "Kritika Singh",
  "Mohit Agarwal", "Roshni Iyer", "Parth Trivedi", "Anjali Shetty", "Vikas Choudhary",
  "Sakshi Gupta", "Abhinav Dubey", "Trisha Nambiar", "Pankaj Yadav", "Shreyansh Das",
  "Komal Verma", "Utkarsh Sharma", "Disha Patel", "Aman Srivastava", "Neha Bajaj",
];

const sources = [
  "website form", "website form", "website form",
  "instagram", "instagram",
  "linkedin", "linkedin",
  "referral",
  "google ads",
  "cold outreach",
];

const statuses = ["new", "new", "contacted", "contacted", "converted"];

const noteTexts = [
  "Called once, no response.",
  "Sent intro email.",
  "Had a 15 min discovery call — interested.",
  "Requested proposal document.",
  "Followed up via WhatsApp.",
  "Meeting scheduled for next week.",
  "Demo completed, awaiting decision.",
  "Sent pricing details.",
  "Client requested revision to proposal.",
  "Verbal confirmation received.",
];

const randomDateInMonth = (monthsAgo) => {
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  date.setDate(Math.floor(Math.random() * 28) + 1);
  date.setHours(Math.floor(Math.random() * 10) + 8);
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateLeads = () => {
  const leads = [];
  for (let monthsAgo = 5; monthsAgo >= 0; monthsAgo--) {
    const countThisMonth = Math.floor(Math.random() * 6) + 12;
    for (let i = 0; i < countThisMonth; i++) {
      const name = pick(names);
      const email = `${name.split(" ")[0].toLowerCase()}${Math.floor(Math.random() * 999)}@example.com`;
      const status = pick(statuses);
      const createdAt = randomDateInMonth(monthsAgo);
      const notes = [];
      if (status === "contacted" || status === "converted") {
        const noteCount = Math.floor(Math.random() * 3) + 1;
        for (let n = 0; n < noteCount; n++) {
          const noteDate = new Date(createdAt);
          noteDate.setDate(noteDate.getDate() + n + 1);
          notes.push({
            text: pick(noteTexts),
            createdAt: noteDate,
            updatedAt: noteDate,
          });
        }
      }
      leads.push({
        name,
        email,
        phone: `+91${Math.floor(7000000000 + Math.random() * 2999999999)}`,
        source: pick(sources),
        status,
        notes,
        createdAt,
        updatedAt: createdAt,
      });
    }
  }
  return leads;
};

// ── Admin accounts to seed ────────────────────────────────────
const admins = [
  { name: "Antony",   email: "icebox1306@gmail.com", password: "1234" },
  { name: "Test User", email: "test@gmail.com",       password: "1234" },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected\n");

    // ── Seed admins ───────────────────────────────────────────
    console.log("Seeding admin accounts...");
    await User.deleteMany({});

    for (const admin of admins) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(admin.password, salt);
      await User.create({
        name:     admin.name,
        email:    admin.email,
        password: hashed,
        role:     "admin",
      });
      console.log(`  ✓ ${admin.email}`);
    }

    // ── Seed leads ────────────────────────────────────────────
    console.log("\nSeeding leads...");
    await Lead.deleteMany({});

    const leads = generateLeads();
    await Lead.insertMany(leads, { timestamps: false });
    console.log(`  ✓ ${leads.length} leads inserted`);

    // ── Summary ───────────────────────────────────────────────
    const byMonth = {};
    leads.forEach((l) => {
      const key = l.createdAt.toLocaleDateString("en-IN", {
        month: "short", year: "2-digit",
      });
      byMonth[key] = (byMonth[key] || 0) + 1;
    });

    console.log("\nLeads per month:");
    Object.entries(byMonth).forEach(([month, count]) => {
      console.log(`  ${month}: ${count} leads`);
    });

    console.log("\nStatus breakdown:");
    ["new", "contacted", "converted"].forEach((s) => {
      console.log(`  ${s}: ${leads.filter((l) => l.status === s).length}`);
    });

    console.log("\nAdmin accounts:");
    admins.forEach((a) => {
      console.log(`  email: ${a.email}  |  password: ${a.password}`);
    });

  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\nDone. MongoDB disconnected.");
  }
};

seed();