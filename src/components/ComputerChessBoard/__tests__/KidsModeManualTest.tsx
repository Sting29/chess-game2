import React from "react";
import { ComputerChessBoard } from "../ComputerChessBoard";
import {
  GameEngineSettings,
  GameUISettings,
} from "../../../config/gameSettings";

/**
 * Manual Test Component for Kids Mode Functionality
 *
 * This component demonstrates the kids mode functionality after the threat analysis button removal.
 *
 * Test Cases:
 * 1. Only hints toggle button should be displayed in kids mode
 * 2. Automatic threat highlighting should work when enabled
 * 3. Threat warning messages should appear correctly
 * 4. No buttons should appear in non-kids mode
 */

const KidsModeManualTest: React.FC = () => {
  // Kids mode settings with threat highlighting enabled
  const kidsEngineSettings: GameEngineSettings = {
    skill: 0,
    depth: 1,
    time: 300,
    MultiPV: 3,
    threads: 1,
    kidsMode: true,
  };

  const kidsUISettings: GameUISettings = {
    showLastMoveArrow: true,
    showThreatHighlight: true,
    showMoveHints: true,
    enableSoundEffects: true,
  };

  // Non-kids mode settings
  const normalEngineSettings: GameEngineSettings = {
    ...kidsEngineSettings,
    kidsMode: false,
  };

  const normalUISettings: GameUISettings = {
    ...kidsUISettings,
    showThreatHighlight: false,
    showMoveHints: false,
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Kids Mode Manual Test</h1>

      <div style={{ marginBottom: "40px" }}>
        <h2>Test Case 1: Kids Mode (Should show only hints toggle button)</h2>
        <div
          style={{
            border: "2px solid #4CAF50",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>Expected Behavior:</h3>
          <ul>
            <li>
              ✅ Only one button should be visible: "👁️ Показать подсказки" or
              "🙈 Скрыть подсказки"
            </li>
            <li>✅ NO "🔍 Проверить угрозы" button should be present</li>
            <li>
              ✅ Automatic threat highlighting should work when pieces are under
              attack
            </li>
            <li>
              ✅ Threat warning messages should appear when threats are detected
            </li>
          </ul>

          <div style={{ marginTop: "20px" }}>
            <ComputerChessBoard
              settings={kidsEngineSettings}
              uiSettings={kidsUISettings}
              onGameEnd={(result) =>
                console.log("Kids mode game ended:", result)
              }
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h2>Test Case 2: Normal Mode (Should show no buttons)</h2>
        <div
          style={{
            border: "2px solid #2196F3",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#f0f8ff",
          }}
        >
          <h3>Expected Behavior:</h3>
          <ul>
            <li>✅ No buttons should be visible above the chessboard</li>
            <li>✅ No threat highlighting should occur</li>
            <li>✅ No threat warning messages should appear</li>
          </ul>

          <div style={{ marginTop: "20px" }}>
            <ComputerChessBoard
              settings={normalEngineSettings}
              uiSettings={normalUISettings}
              onGameEnd={(result) =>
                console.log("Normal mode game ended:", result)
              }
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h2>Test Case 3: Kids Mode with Threat Highlighting Disabled</h2>
        <div
          style={{
            border: "2px solid #FF9800",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#fff8e1",
          }}
        >
          <h3>Expected Behavior:</h3>
          <ul>
            <li>✅ Only hints toggle button should be visible</li>
            <li>✅ No threat highlighting should occur (even in kids mode)</li>
            <li>✅ No threat warning messages should appear</li>
          </ul>

          <div style={{ marginTop: "20px" }}>
            <ComputerChessBoard
              settings={kidsEngineSettings}
              uiSettings={{
                ...kidsUISettings,
                showThreatHighlight: false,
              }}
              onGameEnd={(result) =>
                console.log("Kids mode (no threats) game ended:", result)
              }
            />
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#e8f5e8",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "40px",
        }}
      >
        <h2>Manual Testing Instructions:</h2>
        <ol>
          <li>
            <strong>Kids Mode Test:</strong>
            <ul>
              <li>Verify only the hints toggle button is present</li>
              <li>
                Click the hints button to toggle between "Показать подсказки"
                and "Скрыть подсказки"
              </li>
              <li>
                Make moves that create threats and verify automatic highlighting
                works
              </li>
              <li>
                Check that threat warning messages appear when pieces are under
                attack
              </li>
            </ul>
          </li>
          <li>
            <strong>Normal Mode Test:</strong>
            <ul>
              <li>Verify no buttons are displayed above the chessboard</li>
              <li>Make moves and verify no threat highlighting occurs</li>
            </ul>
          </li>
          <li>
            <strong>Kids Mode (No Threats) Test:</strong>
            <ul>
              <li>
                Verify hints button is present but no threat highlighting occurs
              </li>
            </ul>
          </li>
        </ol>

        <h3>Success Criteria:</h3>
        <p>✅ All test cases pass the expected behavior checks</p>
        <p>✅ No "🔍 Проверить угрозы" button appears in any configuration</p>
        <p>
          ✅ Automatic threat analysis continues to work without manual button
        </p>
      </div>
    </div>
  );
};

export default KidsModeManualTest;
