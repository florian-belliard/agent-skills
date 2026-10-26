// A problem found in the repo. `error` fails `task check`; `warning` is printed and passes.
export type Finding = {
  level: 'error' | 'warning'
  file: string
  message: string
}

export const error = (file: string, message: string): Finding => ({ level: 'error', file, message })

export const warning = (file: string, message: string): Finding => ({
  level: 'warning',
  file,
  message,
})
