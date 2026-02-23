import axios from 'axios'

export const getAdminStats = () => async (dispatch, getState) => {
  try {
    dispatch({ type: 'ADMIN_STATS_REQUEST' })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.get('/api/admin/stats/', config)

    dispatch({
      type: 'ADMIN_STATS_SUCCESS',
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: 'ADMIN_STATS_FAIL',
      payload: error.response?.data?.detail || error.message,
    })
  }
}
