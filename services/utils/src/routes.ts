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

router.post("/resume-analyser", async (req, res) => {
  try {
    const { pdfBase64 } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({ message: "PDF data is required" })
    }
    const prompt = `
      You are an expert ATS (Applicant Tracking System) analyzer.

      Analyze the following resume and provide:

      1. ATS compatibility score (0-100)
      2. Detailed suggestions to improve the resume for better ATS performance

      STRICT REQUIREMENTS:
      - Your entire response MUST be valid JSON only
      - Do NOT include markdown, explanations, or extra text
      - ALL text content inside JSON MUST be written in Vietnamese
      - If you use any language other than Vietnamese, the response is invalid

      Return JSON with this exact structure:

      {
        "atsScore": 85,

        "scoreBreakdown": {
          "formatting": {
            "score": 90,
            "feedback": "Nhận xét ngắn gọn về định dạng"
          },
          "keywords": {
            "score": 80,
            "feedback": "Nhận xét về việc sử dụng từ khóa"
          },
          "structure": {
            "score": 85,
            "feedback": "Nhận xét về cấu trúc CV"
          },
          "readability": {
            "score": 88,
            "feedback": "Nhận xét về độ dễ đọc"
          }
        },

        "suggestions": [
          {
            "category": "Tên nhóm vấn đề (Ví dụ: Định dạng, Nội dung, Từ khóa, Cấu trúc)",
            "issue": "Mô tả vấn đề tìm thấy",
            "recommendation": "Đề xuất cách cải thiện cụ thể",
            "priority": "high/medium/low"
          }
        ],

        "strengths": [
          "Danh sách các điểm mạnh của CV đối với ATS"
        ],

        "summary": "Tóm tắt ngắn 2-3 câu về mức độ tương thích ATS tổng thể"
      }

      Focus on:
      - File format compatibility
      - Standard section headings
      - Keyword optimization
      - Formatting issues (tables, columns, graphics, icons, special characters)
      - Contact information placement
      - Date formatting
      - Action verbs and quantifiable achievements
      - Section organization and logical flow

      Resume content:
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        role: "user",
        parts: [
          {
            text: prompt
          }, {
            inlineData: {
              mimeType: "application/pdf",
              data: pdfBase64.replace(/^data:application\/pdf; base64,/, "")
            }
          }
        ]
      }]
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
