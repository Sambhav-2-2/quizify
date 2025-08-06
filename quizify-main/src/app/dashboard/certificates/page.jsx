"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Download, Search, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch certificates data
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);

        // Add search parameter if provided
        const queryParams = searchTerm
          ? `?search=${encodeURIComponent(searchTerm)}`
          : "";
        const response = await fetch(`/api/certificates${queryParams}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch certificates");
        }

        const data = await response.json();
        setCertificates(data.certificates || []);
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if the component is mounted
    fetchCertificates();
  }, [searchTerm]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="w-full sm:w-[300px]">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[240px] w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <h2 className="text-2xl font-bold text-red-600">
          Error Loading Certificates
        </h2>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
          <p className="text-muted-foreground">
            View and download your earned certificates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search certificates..."
              className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {certificates.length === 0 ? (
        <Card>
          <CardContent className="flex h-[300px] flex-col items-center justify-center">
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">No certificates yet</h3>
              <p className="text-sm text-muted-foreground">
                Complete and pass exams to earn certificates.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/exams">Browse Exams</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <Card key={certificate.id}>
              <CardHeader className="pb-2">
                <CardTitle>{certificate.examTitle}</CardTitle>
                <CardDescription>Certificate of Completion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-[1.414/1] w-full overflow-hidden rounded-md border">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <div className="mb-4 text-xl font-bold">
                      Certificate of Achievement
                    </div>
                    <div className="mb-2">This certifies that</div>
                    <div className="mb-2 text-lg font-medium">
                      {certificate.userName}
                    </div>
                    <div className="mb-2">has successfully completed</div>
                    <div className="mb-4 text-lg font-medium">
                      {certificate.examTitle}
                    </div>
                    <div className="mb-2">
                      with a score of {certificate.score}%
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      Issued on{" "}
                      {new Date(certificate.issueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex w-full gap-2 sm:flex-row">
                  <Button className="w-full" asChild>
                    <Link href={`/dashboard/certificates/${certificate.id}`}>
                      View Certificate
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
