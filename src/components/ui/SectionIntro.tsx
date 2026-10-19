import styles from './SectionIntro.module.css'

interface Props {
  /** Section name, e.g. "Our Products" — rendered as the h2. */
  label: string
  /** Large statement next to the label. */
  statement: string
  /** Supporting paragraphs below the statement. */
  paragraphs: string[]
}

/** Two-column section header: terracotta label on one side, statement + text on the other. */
export function SectionIntro({ label, statement, paragraphs }: Props) {
  return (
    <div className={`container ${styles.intro}`}>
      <h2 className={`${styles.label} role-light`}>{label}</h2>
      <div className={styles.body}>
        <p className={`${styles.statement} role-display`}>{statement}</p>
        {paragraphs.map((text) => (
          <p key={text} className={styles.text}>
            {text}
          </p>
        ))}
      </div>
    </div>
  )
}
