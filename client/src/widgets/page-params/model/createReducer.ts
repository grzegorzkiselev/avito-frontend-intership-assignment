import { PageParams } from ".";
import { defaultActions } from "./defaultActions";

const reducer = (
  actions,
  settings: PageParams,
  action: Action,
) => {
  const handler = actions[
    (action.type.endsWith("Range")
      ? "range"
      : action.type
    )];

  handler
    ? handler.call(actions, settings, action)
    : console.error("No handler for action:", action.type);

  try {
    actions.applySearchParams(settings);
  } catch(error) {
    console.error(error);
  }

  return { ...settings };
};

export const createReducer = (actions: typeof defaultActions) => {
  return reducer.bind(null, actions);
};
