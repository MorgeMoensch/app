import React, { useEffect } from 'react'
import CookieManager from '@react-native-community/cookies'
import { FRONTEND_BASE_URL, CURTAIN_BACKDOOR_PATH } from '../constants'
import { useGlobalState } from '../GlobalState'

// Requires sharedCookiesEnabled={true} prop to be set on WebView
const CookieService = () => {
  const { setGlobalState } = useGlobalState()

  useEffect(() => {
    const setCookies = async () => {
      if (CURTAIN_BACKDOOR_PATH) {
        CookieManager.set(FRONTEND_BASE_URL, {
          name: 'OpenSesame',
          value: encodeURIComponent(CURTAIN_BACKDOOR_PATH),
          path: '/',
          version: '1',
          expires: '2030-05-30T12:30:00.00-05:00',
        }).then(() => {
          setGlobalState({ cookiesLoaded: true })
        })
      }
      return
    }
    setCookies()
  }, [setGlobalState])

  return null
}

export default CookieService
