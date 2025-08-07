export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

/**
 * Dynamically loads the PDF.js library and sets up the worker path.
 */
async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    // Dynamically import PDF.js (ESM build)
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        // Set the worker source to use the local file in public/
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        pdfjsLib = lib;
        return lib;
    });

    return loadPromise;
}

/**
 * Converts the first page of a PDF file to a PNG image using PDF.js and canvas.
 * @param file The PDF file to convert.
 * @returns A Promise that resolves to a PdfConversionResult.
 */
export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        console.log("convertPdfToImage called with file:", file);
        if (!file) {
            console.error("No file provided");
            return { imageUrl: "", file: null, error: "No file provided" };
        }

        const lib = await loadPdfJs();
        console.log("PDF.js loaded:", lib);

        const arrayBuffer = await file.arrayBuffer();
        console.log("ArrayBuffer:", arrayBuffer);

        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        console.log("PDF loaded:", pdf);

        const page = await pdf.getPage(1);
        console.log("PDF page loaded:", page);

        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
            console.error("Canvas context is null");
            return { imageUrl: "", file: null, error: "Canvas context is null" };
        }
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        console.log("Page rendered on canvas");

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const imageFile = new File([blob], "resume.png", {
                            type: "image/png",
                        });
                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        console.error("Failed to create blob");
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                    }
                },
                "image/png",
                1.0
            );
        });
    } catch (err) {
        console.error("Error in convertPdfToImage:", err);
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err instanceof Error ? err.message : String(err)}`,
        };
    }
}