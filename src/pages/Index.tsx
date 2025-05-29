
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TranscriptForm from "@/components/TranscriptForm";
import ExcelUploader from "@/components/ExcelUploader";
import TranscriptPreview from "@/components/TranscriptPreview";
import { TranscriptData } from "@/types/transcript";

const Index = () => {
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Transcript Generator
          </h1>
          <p className="text-lg text-blue-700">
            Lodwar Vocational Training Centre
          </p>
          <p className="text-sm text-blue-600 mt-2">
            Generate single transcripts or batch process up to 200+ students with analytics
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Card className="p-6">
              <Tabs defaultValue="excel" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="excel">Excel Upload</TabsTrigger>
                  <TabsTrigger value="form">Manual Entry</TabsTrigger>
                </TabsList>
                
                <TabsContent value="excel" className="mt-6">
                  <ExcelUploader onDataParsed={setTranscriptData} />
                </TabsContent>
                
                <TabsContent value="form" className="mt-6">
                  <TranscriptForm onSubmit={setTranscriptData} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div>
            {transcriptData && (
              <TranscriptPreview data={transcriptData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
