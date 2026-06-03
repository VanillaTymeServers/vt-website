import VoteSite from "~/server/models/vote_site";
export default defineEventHandler(async (event) => {
    const voteSites = await VoteSite.find().sort({ label: 1 });;
    return voteSites;
});
