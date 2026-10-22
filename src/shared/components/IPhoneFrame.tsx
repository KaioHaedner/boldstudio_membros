import type { ReactNode } from 'react'

/** Shared devices.css frame used by project pages and service showcases. */
export function IPhoneFrame({ children }: { children: ReactNode }) {
  return <div className="bold-iphone-wrap">
    <div className="device device-iphone-x bold-iphone">
      <div className="device-frame">{children}</div>
      <div className="device-stripe" />
      <div className="device-header" />
      <div className="device-sensors" />
      <div className="device-btns" />
      <div className="device-power" />
    </div>
  </div>
}
