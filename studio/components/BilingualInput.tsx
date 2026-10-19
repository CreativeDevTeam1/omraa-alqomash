import {Grid} from '@sanity/ui'
import {MemberField, type ObjectInputProps} from 'sanity'

/** English and Arabic inputs side by side (stacked on narrow screens). */
export function BilingualInput(props: ObjectInputProps) {
  const {members, renderField, renderInput, renderItem, renderPreview} = props
  return (
    <Grid columns={[1, 1, 2] as never} gap={4}>
      {members
        .filter((member) => member.kind === 'field')
        .map((member) => (
          <MemberField
            key={member.key}
            member={member}
            renderField={renderField}
            renderInput={renderInput}
            renderItem={renderItem}
            renderPreview={renderPreview}
          />
        ))}
    </Grid>
  )
}
