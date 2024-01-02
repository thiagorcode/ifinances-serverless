import axios from 'axios'
export const sendMessageToTelegram = (chatId: string, message: string) => {
  return axios.post(`https://api.telegram.org/bot${process.env.TOKEN_TELEGRAM}/sendMessage`, {
    form: {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    },
  })
}
