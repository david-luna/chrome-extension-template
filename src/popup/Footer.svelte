<script lang="ts">
  import { sendMessage } from '../messaging';
  import { MessageType } from "../types";

  function onClick() {
    sendMessage({ type: MessageType.RELOAD_PAGE });
    self.close();
  }
</script>

<footer class="popup-footer">
  <span class="popup-footer__love">
    Extension by @author
  </span>
  <div>
    <button
      id="reload"
      class="popup-footer__reload"
      on:click={(event) => onClick()}
    >
      Reload
    </button>
  </div>
</footer>

<style>
  .popup-footer {
    color: #fff;
    background-color: #18165f;
    display: flex;
    justify-content: space-between;
  }

  .popup-footer__love {
    align-self: center;
    margin: var(--spacing-sp-1);
  }

  .popup-footer__reload {
    color: #fff;
    margin: var(--spacing-sp-0-5);
  }
</style>

