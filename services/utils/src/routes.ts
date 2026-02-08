import express from "express";
import cloudinary from "cloudinary";

const router = express.Router();

router.post("/upload", async (req, res) => {
  try {
    const { buffer, public_id } = req.body;
    if (public_id) {
      await cloudinary.v2.uploader.destroy(public_id);
    }

    const cloud = await cloudinary.v2.uploader.upload(buffer);

    res.json({
      url: cloud.secure_url,
      public_id: cloud.public_id,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
});

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY_GEMINI });

router.post("/career", async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills) {
      return res.status(400).json({
        message: "Skills Required"
      })
    }
    const prompt = `
      Based on the following skills: ${skills}.
      Please act as a career advisor and generate a career path suggestion.

      Your entire response must be in a valid JSON format.
      Do not include any text or markdown formatting outside of the JSON structure.

      IMPORTANT:
      All text content inside the JSON must be written in Vietnamese.

      The JSON object should have the following structure:

      {
        "summary": "Tóm tắt ngắn gọn, mang tính khích lệ về kỹ năng của người dùng và vị trí công việc phù hợp.",

        "jobOptions": [
          {
            "title": "Tên vị trí công việc.",
            "responsibilities": "Mô tả những việc người dùng sẽ làm trong vai trò này.",
            "why": "Giải thích vì sao công việc này phù hợp với kỹ năng của họ."
          }
        ],

        "skillsToLearn": [
          {
            "category": "Nhóm kỹ năng cần cải thiện (ví dụ: 'Nâng cao chuyên môn stack hiện tại', 'DevOps & Cloud').",
            "skills": [
              {
                "title": "Tên kỹ năng cần học.",
                "why": "Vì sao kỹ năng này quan trọng.",
                "how": "Cách học hoặc áp dụng cụ thể."
              }
            ]
          }
        ],

        "learningApproach": {
          "title": "Cách tiếp cận việc học",
          "points": [
            "Danh sách các lời khuyên hành động cụ thể."
          ]
        }
      }
    `;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    })

    let jsonResponse;

    try {
      const rawText = response.text?.replace(/```json/g, "").replace(/```/g, "").trim();

      if (!rawText) {
        throw new Error("Ai did not return a valid text response")
      }

      jsonResponse = JSON.parse(rawText)
    } catch (error) {
      return res.status(500).json({
        message: "Ai returned response that was not valid JSON",
        rawResponse: response.text
      })
    }
    res.json(jsonResponse)
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    })
  }
})

export default router;
