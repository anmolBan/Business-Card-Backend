const zod = require('zod');

const adminData = zod.object({
    username: zod.string().email(), 
    password: zod.string().min(8).max(15)
});

const createCard = zod.object({
    name: zod.string(),
    description: zod.string(),
    interests: zod.array(zod.string()),
    linkedin: zod.string().url(),
    github: zod.string().url()
});

const cardId = zod.string();

const updateCard = zod.object({
    id: zod.string(),
    cardData: zod.object({
        name: zod.string(),
        description: zod.string(),
        interests: zod.array(zod.string()),
        linkedin: zod.string().url(),
        github: zod.string().url()
    })
});

module.exports = {
    adminData: adminData,
    createCard: createCard,
    cardId: cardId,
    updateCard: updateCard
}