import { Kafka, logLevel } from "kafkajs"
import nodemailer from "nodemailer"


export const startSendMailConsumer = async () => {
  try {
    const kafka = new Kafka({
      clientId: 'mail-service',
      brokers: [process.env.KAFKA_BROKER!],
      retry: {
        retries: 20,
        initialRetryTime: 3000,
        maxRetryTime: 30000
      },
      logLevel: logLevel.ERROR,
    })

    const consumer = kafka.consumer({ groupId: "mail-service-group" })

    await consumer.connect()

    const topicName = "send-mail"

    await consumer.subscribe({ topic: topicName, fromBeginning: false })

    console.log("Mail service consumer started, listening for sending mail")

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const { to, subject, html } = JSON.parse(message.value?.toString() || "{}")

          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: "xyz",
              pass: "yzx"
            }
          })

          await transporter.sendMail({
            from: "Hireheaven <no-reply>",
            to,
            subject,
            html
          })

          console.log(`Mail has been sent to ${to}`)
        } catch (error) {
          console.log("Failed to send mail", error)
        }
      }
    })
  } catch (error) {
    console.log("Failed to start kafka consumer", error)
  }
}