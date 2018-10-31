import { storiesOf }  from '@storybook/vue';
import { withInfo }   from 'storybook-addon-vue-info';
import VuePanel       from './VuePanel.vue';
import VuePanelHeader from './VuePanelHeader/VuePanelHeader.vue';
import VuePanelBody   from './VuePanelBody/VuePanelBody.vue';
import VuePanelFooter from './VuePanelFooter/VuePanelFooter.vue';
import VueButton      from '../VueButton/VueButton.vue';

const story = (storiesOf('2. Components|Panel', module) as any);

story.add('Default', withInfo({ propTablesExclude: [VueButton] })(() => ({
  components: {
    VuePanel,
    VuePanelHeader,
    VuePanelBody,
    VuePanelFooter,
    VueButton,
  },
  template:   `<vue-panel>
  <vue-panel-header title="Title" subtitle="subtitle" image="https://avatars2.githubusercontent.com/u/1667598?s=460&v=4" />
  <vue-panel-body>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
    labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
    et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut
    labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
    et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
  </vue-panel-body>
  <vue-panel-footer>
    <vue-button danger>Delete</vue-button>
    <vue-button primary ghost>Cancel</vue-button>
  </vue-panel-footer>
</vue-panel>`,
})));
