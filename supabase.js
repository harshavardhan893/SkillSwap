
const SUPABASE_URL = "https://vulxmcwuwetfkmkfxyqt.supabase.co";

const SUPABASE_KEY = "sb_publishable_sLB8YwzuE0_KvLTXXFbCaA_PYNKtkjR";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase connected successfully!");
async function logout() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        alert("Logout failed: " + error.message);
        return;
    }

    window.location.href = "login.html";
}