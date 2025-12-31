export const generateFollowUpSuggestion = ({ name, status }) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let message = ""

            if (status === "New") {
                message = `Hi ${name}, I’m reaching out to follow up on your recent interest. Let me know if you’d like more details.`
            } else if (status === "Converted") {
                message = `Hi ${name}, welcome onboard. Please feel free to reach out if you need any assistance.`
            } else {
                message = `Hi ${name}, just checking in to see if you had a chance to review my previous message.`
            }

            resolve(message)
        }, 700)
    })
}
