import axios from 'axios'
export const sendMessageToTelegram = (chatId: string, message: string) => {
  const formData = new FormData()
  formData.append('chat_id', chatId)
  formData.append('text', message)
  // formData.append('parse_mode', 'HTML')
  // return axios.post(`https://api.telegram.org/bot${process.env.TOKEN_TELEGRAM}/sendMessage`, formData, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   },
  // })
  return axios.post(
    `https://api.telegram.org/bot6021432145:AAH3AveosAqd_cQJv-H6hUaimvPtnJVueyE/sendMessage`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
}
