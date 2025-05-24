import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose
        .connect(
            "mongodb+srv://subhrajittalukdar411:subhra123@cluster0.8pzpzn2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        )
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((err) => console.error("Connection error:", err));
};
