import CircularSlider from "../../components/circularSlider/component";
import { Counter } from "../../definitions";

/**
 * Sliders component props.
 *
 * @typedef {Object} SlidersProps
 * @property {Counter[]} counters - An array of counter objects.
 */
type SlidersProps = {
  counters: Counter[];
};

/**
 * Sliders component that renders a list of CircularSlider components.
 *
 * @param {SlidersProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
const Sliders = (props: SlidersProps) => {
  const { counters } = props;
  return (
    <>
      {counters.map((c) => (
        <div key={c.id} id={c.id}>
          <CircularSlider onSubmit={console.log} isDone={false}>
            <div>
              <b>{c.label}</b>
              <small>
                {c.currentSteps * c.unitsInStep} /
                {c.dailyGoalOfSteps * c.unitsInStep} {c.unitsName}
              </small>
            </div>
          </CircularSlider>
        </div>
      ))}
    </>
  );
};

export default Sliders;
