import { useEffect, useRef } from "react";
import BpmnViewer from "bpmn-js/lib/NavigatedViewer";

interface BPMNViewerProps {
  xml: string;
  className?: string;
}

export default function BPMNViewer({ xml, className = "" }: BPMNViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<BpmnViewer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const viewer = new BpmnViewer({
      container: containerRef.current,
      keyboard: {
        bindTo: document,
      },
    });

    viewerRef.current = viewer;

    viewer
      .importXML(xml)
      .then(() => {
        const canvas = viewer.get("canvas") as { zoom: (level: string) => void };
        canvas.zoom("fit-viewport");
      })
      .catch((err: Error) => {
        console.error("Error rendering BPMN diagram:", err);
      });

    return () => {
      viewer.destroy();
    };
  }, [xml]);

  return (
    <div
      ref={containerRef}
      className={`bpmn-container bg-white border border-concrete-grey rounded-lg ${className}`}
      style={{ minHeight: "600px" }}
    />
  );
}
