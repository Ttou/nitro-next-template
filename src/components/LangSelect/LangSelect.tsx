import { ElOption, ElSelect } from 'element-plus'

import { computed, defineComponent } from 'vue'
import { LangEnum } from '~shared/enums'
import { useAppStore } from '~web/store'
import styles from './LangSelect.module.css'

export default defineComponent({
  name: 'LangSelect',
  setup() {
    const appStore = useAppStore()

    const locale = computed(() => appStore.locale)

    return {
      locale,
      setLocale: appStore.setLocale,
    }
  },
  render() {
    return (
      <ElSelect
        class={styles.langSelect}
        modelValue={this.locale}
        size="small"
        filterable={false}
        onChange={val => this.setLocale(val)}
      >
        {LangEnum.items.map(item => <ElOption value={item.value} label={item.label} />)}
      </ElSelect>
    )
  },
})
