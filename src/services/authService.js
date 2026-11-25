import { supabase } from "../config/supabase";

export const signUp = async (email, password, fullName, role) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: role,
            },
        },
    });

    if (error) {
        throw error;
    }

    return data;
};

export const createUserProfile = async (
    userId,
    email,
    fullName,
    role,
    companyName,
) => {
    const newUser = {
        supabaseId: userId,
        role,
        fullName,
        email,
        companyName: role === "employer" ? companyName : "",
        phone: "",
        location: "",
        headline: "",
        avatar: null,
        about: "",
        skills: [],
        experience: [],
        education: [],
        links: {},
    };

    const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
    });

    if (!response.ok) {
        throw new Error("Failed to create user profile");
    }

    return await response.json();
};

export const registerUser = async (
    email,
    password,
    fullName,
    role,
    companyName,
) => {
    const data = await signUp(email, password, fullName, role);

    if (data.user) {
        await createUserProfile(
            data.user.id,
            email,
            fullName,
            role,
            companyName,
        );
    }

    return data;
};

export const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    return data;
};