import { forwardRef, useImperativeHandle, useRef } from 'react'
import HCaptcha from '@hcaptcha/react-hcaptcha'

// Chave PUBLICA de teste do hCaptcha (sempre valida em DEV).
// Em producao, defina VITE_HCAPTCHA_SITE_KEY com a site key real
// (configurada no painel hCaptcha + colada no Supabase Auth Settings).
const FALLBACK_TEST_SITE_KEY = '10000000-ffff-ffff-ffff-000000000001'

export interface CaptchaWidgetHandle {
  reset: () => void
}

interface CaptchaWidgetProps {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: (err: string) => void
}

export const CaptchaWidget = forwardRef<CaptchaWidgetHandle, CaptchaWidgetProps>(
  function CaptchaWidget({ onVerify, onExpire, onError }, ref) {
    const captchaRef = useRef<HCaptcha | null>(null)
    const siteKey = (import.meta.env.VITE_HCAPTCHA_SITE_KEY as string | undefined) ?? FALLBACK_TEST_SITE_KEY

    useImperativeHandle(ref, () => ({
      reset: () => captchaRef.current?.resetCaptcha(),
    }))

    return (
      <div className="flex justify-center">
        <HCaptcha
          ref={captchaRef}
          sitekey={siteKey}
          theme="dark"
          onVerify={onVerify}
          onExpire={onExpire}
          onError={onError}
        />
      </div>
    )
  }
)
