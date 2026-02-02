"use client";

import { useAuth } from "@/lib/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Share2,
  Smartphone,
  CheckCircle2,
  Copy,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Generate QR code as SVG using a simple algorithm
function generateQRCodeSVG(data: string, size: number = 200): string {
  // Simple QR-like pattern generator for CPS numbers
  // In production, use a proper QR library
  const moduleCount = 21; // 21x21 for Version 1 QR
  const moduleSize = size / moduleCount;
  
  // Create a deterministic pattern from the data
  const hash = data.split("").reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, 0);
  
  let modules: boolean[][] = [];
  for (let row = 0; row < moduleCount; row++) {
    modules[row] = [];
    for (let col = 0; col < moduleCount; col++) {
      // Position detection patterns (corners)
      const isPositionPattern = 
        (row < 7 && col < 7) || // Top-left
        (row < 7 && col >= moduleCount - 7) || // Top-right
        (row >= moduleCount - 7 && col < 7); // Bottom-left
      
      if (isPositionPattern) {
        // Create finder patterns
        const inTopLeft = row < 7 && col < 7;
        const inTopRight = row < 7 && col >= moduleCount - 7;
        const inBottomLeft = row >= moduleCount - 7 && col < 7;
        
        let r = row;
        let c = col;
        if (inTopRight) c -= (moduleCount - 7);
        if (inBottomLeft) r -= (moduleCount - 7);
        
        // Outer ring (dark)
        if (r === 0 || r === 6 || c === 0 || c === 6) {
          modules[row][col] = true;
        }
        // White ring
        else if (r === 1 || r === 5 || c === 1 || c === 5) {
          modules[row][col] = false;
        }
        // Inner square (dark)
        else {
          modules[row][col] = true;
        }
      } else {
        // Data area - use hash to create pattern
        const seed = hash + row * moduleCount + col;
        modules[row][col] = (seed * 9301 + 49297) % 233280 > 116640;
      }
    }
  }
  
  // Generate SVG
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`;
  svg += `<rect width="100%" height="100%" fill="white"/>`;
  
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (modules[row][col]) {
        svg += `<rect x="${col * moduleSize}" y="${row * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="black"/>`;
      }
    }
  }
  
  svg += `</svg>`;
  return svg;
}

export default function QRCodePage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [qrSvg, setQrSvg] = useState<string>("");
  const qrRef = useRef<HTMLDivElement>(null);

  const cpsNumber = user?.cps_number || "CPS00000000";

  useEffect(() => {
    // Generate QR code for the CPS number
    const svg = generateQRCodeSVG(cpsNumber, 200);
    setQrSvg(svg);
  }, [cpsNumber]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cpsNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Chakula Poa CPS Number",
          text: `My CPS Number: ${cpsNumber}`,
        });
      } catch {
        // User cancelled or error
      }
    }
  };

  const handleDownload = () => {
    // Create a canvas from the SVG and download
    const svgBlob = new Blob([qrSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chakula-poa-qr-${cpsNumber}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
          My QR Code
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Show this at the canteen to collect your meals
        </p>
      </div>

      <div className="mx-auto max-w-md">
        {/* QR Code Card */}
        <Card className="overflow-hidden border-0 shadow-xl">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-4 text-center sm:p-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm sm:mb-4 sm:px-4 sm:py-1.5">
              <CheckCircle2 className="h-3 w-3 text-primary-foreground sm:h-4 sm:w-4" />
              <span className="text-xs font-medium text-primary-foreground sm:text-sm">
                Active Student
              </span>
            </div>
            <h2 className="mb-1 text-lg font-bold text-primary-foreground sm:text-xl">
              {user?.first_name} {user?.last_name || "Student"}
            </h2>
            <p className="text-xs text-primary-foreground/80 sm:text-sm">
              {user?.university_name || "University of Dar es Salaam"}
            </p>
          </div>

          <CardContent className="p-4 sm:p-6 lg:p-8">
            {/* QR Code */}
            <div className="mb-4 flex aspect-square items-center justify-center rounded-2xl bg-white p-4 shadow-inner sm:mb-6 sm:p-6">
              <div className="text-center" ref={qrRef}>
                <div 
                  className="mx-auto mb-3 sm:mb-4"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
                <p className="text-xs text-muted-foreground">Scan to verify</p>
              </div>
            </div>

            {/* CPS Number */}
            <div className="mb-4 rounded-xl bg-muted/50 p-3 text-center sm:mb-6 sm:p-4">
              <p className="mb-1 text-xs text-muted-foreground sm:text-sm">
                Your CPS Number
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold tracking-wider text-primary sm:text-3xl">
                  {cpsNumber}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-10 bg-transparent sm:h-12"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                <span className="text-sm">Download</span>
              </Button>
              <Button
                variant="outline"
                className="h-10 bg-transparent sm:h-12"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                <span className="text-sm">Share</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6 border-border/50">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 sm:h-10 sm:w-10">
                <span className="text-xs font-bold text-primary sm:text-sm">
                  1
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground sm:text-base">
                  Go to the canteen
                </p>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Visit during your meal time (breakfast, lunch, or dinner)
                </p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 sm:h-10 sm:w-10">
                <span className="text-xs font-bold text-primary sm:text-sm">
                  2
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground sm:text-base">
                  Show your QR code or CPS number
                </p>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  The staff will scan your code or enter your CPS number
                </p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 sm:h-10 sm:w-10">
                <span className="text-xs font-bold text-primary sm:text-sm">
                  3
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground sm:text-base">
                  Collect your meal
                </p>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {"Once verified, you'll receive your pre-selected meal"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offline Access */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent className="flex items-start gap-3 p-3 sm:p-4">
            <Smartphone className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground sm:text-base">
                No internet?
              </p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Just tell the staff your CPS number:{" "}
                <span className="font-semibold text-primary">
                  {cpsNumber}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
