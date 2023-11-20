<template>
  <div class="admin pa4 lh-copy">
    <h1 class="f2 fw6">使用者權限管理</h1>
    <p class="f4 mb4">
      只有協作者 + 管理員可以判讀報告書，管理員另外也可以將報告書標為已驗證。
    </p>
    <table class="w-100 ba b--moon-gray" cellspacing="0">
      <thead>
        <tr class="bg-light-gray">
          <th class="pv2 ph3 tl">使用者名稱</th>
          <th class="pv2 ph3 tl">電子郵件</th>
          <th class="pv2 ph3 tl">身份</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in userList" :key="user.id">
          <td class="pv2 ph3 bt b--moon-gray flex items-center">
            <span :title="ROLE_MAP[user.role]" class="mr2">{{ ROLE_ICON_MAP[user.role] }}</span>
            {{ user.name }}
          </td>
          <td class="pv2 ph3 bt b--moon-gray">{{ user.email }}</td>
          <td class="pv2 ph3 bt b--moon-gray">
            <select name="role" :value="user.role" class="admin__role" @change="changeRole(user, $event)">
              <option v-for="role in ROLE_LIST" :key="role" :value="role">
                {{ ROLE_MAP[role] }}
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts" setup>
import { userSchema } from '~/libs/feathers/services/users/users.schema'
const { feathers, user: me } = useProfessionApi()

const userList = ref<typeof userSchema[]>([])

const ROLE_MAP = {
  admin: '管理員',
  collaborator: '協作者',
  visitor: '訪客'
} as any

const ROLE_ICON_MAP = {
  admin: '🧙',
  collaborator: '🖊️',
  visitor: '👤'
} as any

const ROLE_LIST = Object.keys(ROLE_MAP)

const snackbar = useSnackbar()

function getUserList () {
  feathers.app
    .service('users')
    .find({})
    .then((res: any) => {
      userList.value = res.data
    })
}

async function changeRole (user: typeof userSchema, event: { target: HTMLSelectElement }) {
  const newRole = event.target.value
  if (user.id === me.value.id) {
    snackbar.add({
      type: 'error',
      text: '不可以更改自己的身份喔！（搖指） 好險機器人有發現，不然改完你就看不到這頁惹 🤖🤖'
    })
    event.target.value = user.role
    return
  }
  if (newRole !== user.role) {
    await feathers.app
      .service('users')
      .patch(user.id, {
        role: newRole
      })
    user.role = newRole
    snackbar.add({
      type: 'success',
      text: `已將 ${user.name} 身份改為 ${ROLE_MAP[newRole]}`
    })
  }
}

watchImmediate(
  () => feathers.isReady.value,
  (isReady) => {
    if (isReady) {
      getUserList()
    }
  }
)

</script>
<style lang="scss" scoped>
.admin {
  width: $professionWidth;
  max-width: 100vw;
  margin: 0 auto;

  &__role {
    width: 6rem;
  }
}
</style>
