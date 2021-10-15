
step('I have some background knowledge', () => {})
step(/I can easily become (developer|tester)/, (role) => {
    console.log("role selected:", role);
});
step(/(.*) these tests/, (action) => {
    console.log("action selected:", action);
});
But("they don't fail", () => {
    //do nothing
});
