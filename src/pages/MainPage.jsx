import { useState } from 'react';
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchSERPData, fetchPageSpeedDataForURLs } from '@/services/api';
import { getDomainFromUrl } from '@/utils/urlUtils';
import data from '@/data/location_language_data.json';
import {
  parseTop10URLs,
  prepareURLsForAnalysis,
} from "@/services/seoService";

function MainPage() {
  const [keyword, setKeyword] = useState('');
  const [url, setUrl] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [languages, setLanguages] = useState(Object.keys(data.languages));
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const frequentCountries = ['United States', 'United Kingdom', 'France'];
  const [pageSpeedResults, setPageSpeedResults] = useState([]);

  const handleAnalysis = async (serpData) => {
    try {
      const top10URLs = parseTop10URLs(serpData);
      const urlsToAnalyze = prepareURLsForAnalysis(url, top10URLs);

      // Fetch performance data from the backend
      const results = await fetchPageSpeedDataForURLs(urlsToAnalyze);
      setPageSpeedResults(results);
    } catch (error) {
      console.error("Error during analysis:", error);
      alert("Failed to analyze PageSpeed data. Please try again.");
    }
  };

  const [locations] = useState(() => {
    const allCountries = Object.keys(data.locations);
    const remainingCountries = allCountries.filter(
      (country) => !frequentCountries.includes(country)
    );
    return [...frequentCountries, ...remainingCountries];
  });

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    const availableLanguages = data.locations[location] || [];
    if (!availableLanguages.includes(selectedLanguage)) {
      setSelectedLanguage(null);
    }
    setLanguages(availableLanguages);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    // Optionally, you can perform additional checks or operations here if needed
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!keyword || !selectedLanguage || !selectedLocation || !url) {
      alert("Please fill in all fields.");
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      alert("Please enter a valid URL with http:// or https://");
      return;
    }

    setLoading(true);

    try {
      const domain = getDomainFromUrl(url);

      // Fetch SERP data
      const serpData = await fetchSERPData({
        keyword,
        language_name: selectedLanguage,
        location_name: selectedLocation,
        target: domain,
      });

      // Analyze PageSpeed data
      await handleAnalysis(serpData);

      setResults({
        keyword,
        language: selectedLanguage,
        location: selectedLocation,
        fullURL: url,
        serpData,
      });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-lg font-bold tracking-tight">SERP Speed Checker</h2>
      <div className="items-center space-x-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-row flex-wrap gap-4">
            <div>
              <label className="block font-medium mb-1">Keyword</label>
              <Input
                placeholder="Enter a keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">My URL</label>
              <Input
                placeholder="Enter a URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Country</label>
              <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={countryOpen}
                    className="w-[200px] justify-between"
                  >
                    {selectedLocation || "Select Country..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {locations.map((loc) => {
                          const isLastFrequent =
                            frequentCountries.includes(loc) &&
                            frequentCountries.indexOf(loc) === frequentCountries.length - 1;

                          return (
                            <CommandItem
                              key={loc}
                              value={loc}
                              onSelect={() => {
                                handleLocationSelect(loc);
                                setCountryOpen(false);
                              }}
                              className={isLastFrequent ? "border-b" : ""}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedLocation === loc ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {loc}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block font-medium mb-1">Language</label>
              <Popover open={languageOpen} onOpenChange={setLanguageOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={languageOpen}
                    className="w-[200px] justify-between"
                  >
                    {selectedLanguage || "Select Language..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search language..." />
                  <CommandList>
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {languages.map((lang) => (
                        <CommandItem
                          key={lang}
                          value={lang}
                          onSelect={() => {
                            // Handle language selection before closing the dropdown
                            handleLanguageSelect(lang);
                            setTimeout(() => setLanguageOpen(false), 0); // Use a slight delay
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedLanguage === lang ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {lang}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Checking...' : 'Check SERP Speed'}
          </Button>
        </form>
      </div>
      {results && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Results</h3>
          <div>
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">Speed Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageSpeedResults.map((result, index) => (
                  <TableRow key={result.url}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{result.url}</TableCell>
                    <TableCell className="text-right">
                      {result.performanceScore !== undefined ? result.performanceScore : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;