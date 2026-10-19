import type {InputProps} from 'sanity'

/** The Arabic input is right-to-left. */
export function RtlInput(props: InputProps) {
  return <div dir="rtl">{props.renderDefault(props)}</div>
}
