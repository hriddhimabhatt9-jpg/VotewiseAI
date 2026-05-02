"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ScanLine, 
  Upload, 
  CheckCircle2, 
  FileText, 
  Search, 
  AlertCircle,
  Camera,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useLangStore } from "@/store";
import { translations } from "@/lib/data";
import toast from "react-hot-toast";

export default function ScannerPage() {
  const { lang } = useLangStore();
  const t = translations[lang];
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const startScan = () => {
    if (!file) return;
    setIsScanning(true);
    
    // Simulate AI scanning process
    setTimeout(() => {
      setIsScanning(false);
      setResult({
        type: "Voter ID (EPIC)",
        name: "DEMO USER",
        idNumber: "ABC1234567",
        constituency: "New Delhi",
        valid: true,
        confidence: 98.5
      });
      toast.success("Document scanned successfully! 🎉");
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <ScanLine className="w-8 h-8 text-blue-500" /> {t.docScanner}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your Voter ID or election documents for AI verification and data extraction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card glass className="overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-800">
          <CardContent className="p-0">
            {preview ? (
              <div className="relative group">
                <img src={preview} alt="Preview" className="w-full h-80 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="w-4 h-4 mr-2" /> Change
                  </Button>
                </div>
                {isScanning && (
                  <motion.div 
                    initial={{ top: 0 }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-10"
                  />
                )}
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="h-80 flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-blue-500" />
                </div>
                <p className="font-bold text-lg mb-1">Click to Upload</p>
                <p className="text-sm text-gray-500 text-center">or drag and drop your document here</p>
                <div className="mt-6 flex gap-2">
                  <Badge variant="default">JPEG</Badge>
                  <Badge variant="default">PNG</Badge>
                  <Badge variant="default">PDF</Badge>
                </div>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-6">
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full h-14 text-lg shadow-xl shadow-blue-500/20"
            disabled={!file || isScanning}
            onClick={startScan}
          >
            {isScanning ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing Document...</>
            ) : (
              <><ScanLine className="w-5 h-5 mr-2" /> Start AI Scan</>
            )}
          </Button>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Card glass className="border-emerald-500/30 bg-emerald-50/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Scan Complete</h3>
                        <p className="text-sm text-gray-500">AI Confidence: {result.confidence}%</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500 text-sm">Doc Type</span>
                        <span className="font-bold">{result.type}</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500 text-sm">Name</span>
                        <span className="font-bold">{result.name}</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500 text-sm">EPIC Number</span>
                        <span className="font-bold tracking-widest">{result.idNumber}</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500 text-sm">Constituency</span>
                        <span className="font-bold">{result.constituency}</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-6">
                      Add to Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {!file && !isScanning && (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p>Upload a document to see AI-extracted details here.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
