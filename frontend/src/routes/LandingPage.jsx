import { useNavigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";

export default function IntroPage() {
  const navigate = useNavigate();
  const { enableGuestMode } = useSession();

  return (
    <>
      {/* other UI */}

      <button
        onClick={() => {
          enableGuestMode();   // 🔑 THIS WAS MISSING
          navigate("/app");
        }}
        className="..."
      >
        Try Guest Demo
      </button>
    </>
  );
}
