"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, ArrowLeft, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";

export default function CertificatePage({ params }) {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const param = useParams();
  const paramsID = param.id;

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        // First get certificate details from the certificates API
        const response = await fetch(`/api/certificates?resultId=${paramsID}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch certificate");
        }
        
        const data = await response.json();
        
        if (data.certificates && data.certificates.length > 0) {
          setCertificate(data.certificates[0]);
        } else {
          throw new Error("Certificate not found");
        }
      } catch (err) {
        console.error("Error fetching certificate:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [paramsID]);

  const handleDownload = () => {
    // Redirect to the download endpoint
    window.location.href = `/api/certificates/${paramsID}/download`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <Skeleton className="h-8 w-1/2 mb-4" />
        
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[500px] w-full rounded-md" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <h2 className="text-2xl font-bold text-red-600">Error Loading Certificate</h2>
        <p>{error || "Certificate not found"}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{certificate.examTitle} Certificate</h1>
        <p className="text-muted-foreground">
          Issued on {new Date(certificate.issueDate).toLocaleDateString()}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" /> Certificate of Achievement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-[1.414/1] w-full overflow-hidden rounded-md border bg-slate-50">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-6 text-2xl font-bold">Certificate of Achievement</div>
              <div className="mb-2 text-lg">This certifies that</div>
              <div className="mb-4 text-2xl font-bold">{certificate.userName}</div>
              <div className="mb-2 text-lg">has successfully completed</div>
              <div className="mb-4 text-2xl font-semibold">{certificate.examTitle}</div>
              <div className="mb-6 text-lg">with a score of {certificate.score}%</div>
              <div className="mt-8 text-sm text-muted-foreground">
                Issued on {new Date(certificate.issueDate).toLocaleDateString()}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Certificate ID: {certificate.id}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full gap-2">
            <Button className="w-full" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Certificate
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}