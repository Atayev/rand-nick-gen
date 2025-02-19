const axios = require("axios");

async function generateAINickname(nicknames) {
  if (!nicknames.length) return "DefaultNick";
  const model = process.env.MODEL || "gpt-4";
  const defaultPrompt = process.env.DEFAULT_PROMPT;
  const max_tokens = process.env.MODEL_MAX_TOKENS || 100;
  const url = "https://api.openai.com/v1/chat/completions";
  // Step 1: Extract common patterns
  let commonPrefix = findCommonPrefix(nicknames);
  let commonSuffix = findCommonSuffix(nicknames);
  let randomNumber = Math.floor(Math.random() * 100);

  // Generate a base nickname
  //   let baseNickname = commonPrefix + commonSuffix + randomNumber;

  let prompt = `Given these nicknames: ${nicknames.join(
    ", "
  )}, ${defaultPrompt}`;

  try {
    // Step 2: Use OpenAI to refine the nickname
    const response = await axios.post(
      url,
      {
        model: model,
        messages: [
          {
            role: "system",
            content:
              "You are a creative nickname generator. Your task is to generate a unique and imaginative new nickname based on the given nicknames. Consider their style, patterns, and themes to create a fresh yet related nickname that stands out.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: +max_tokens,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(
      response.data.choices[0].message.content.trim(),
      "AI generated nickname"
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return {
      success: false,
      message: "Failed to generate nickname",
      error: error.response ? error.response.data : error.message,
    };
  }
}

// Helper function to find common prefix
function findCommonPrefix(names) {
  if (!names.length) return "";
  let prefix = names[0];
  for (let i = 1; i < names.length; i++) {
    while (names[i].indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (prefix === "") return "";
    }
  }
  return prefix;
}

// Helper function to find common suffix
function findCommonSuffix(names) {
  if (!names.length) return "";
  let suffix = names[0];
  for (let i = 1; i < names.length; i++) {
    while (!names[i].endsWith(suffix)) {
      suffix = suffix.substring(1);
      if (suffix === "") return "";
    }
  }
  return suffix;
}

module.exports = { generateAINickname };
