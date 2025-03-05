import mixpanel from "mixpanel-browser";

mixpanel.init("b961edcc392ca662d297925d99c0f547", {
  debug: import.meta.env.MODE !== "production",
  track_pageview: true,
  persistence: "localStorage",
});

export const Mixpanel = {
  identify: (id) => {
    mixpanel.identify(id);
  },
  alias: (id) => {
    mixpanel.alias(id);
  },
  track: (name, props) => {
    mixpanel.track(name, props);
  },
  people: {
    set: (props) => {
      mixpanel.people.set(props);
    },
  },
};

export { mixpanel };
