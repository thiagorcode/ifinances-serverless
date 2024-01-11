import axios from 'axios'
export const sendMessageToTelegram = (tokenTelegram: string, chatId: string, message: string) => {
  const formData = new FormData()
  formData.append('chat_id', chatId)
  formData.append('text', message)
  // TODO: Transformar em um repository
  return axios.post(`https://api.telegram.org/bot${tokenTelegram}/sendMessage`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
