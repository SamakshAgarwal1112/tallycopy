import CodeEditor from "../../components/CodeEditor";
import TestCaseTabs from "@/components/TestCaseTabs";

function PlayGround() {
  return (
    <div className="mr-0 ml-auto overflow-hidden w-[70vh] flex flex-col gap-5 px-2 ">
      <CodeEditor />
      <TestCaseTabs />
    </div>
  );
}

export default PlayGround;