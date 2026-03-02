using System;
using System.Threading.Tasks;

namespace InsureX.SeedTool;

class Program
{
    static async Task Main(string[] args)
    {
        Console.WriteLine("InsureX Seed Tool");
        Console.WriteLine("=================");
        
        if (args.Length == 0)
        {
            ShowHelp();
            return;
        }

        var command = args[0].ToLower();
        
        switch (command)
        {
            case "generate":
                await GenerateTestData(args);
                break;
            case "export":
                await ExportData(args);
                break;
            case "import":
                await ImportData(args);
                break;
            default:
                ShowHelp();
                break;
        }
    }

    static void ShowHelp()
    {
        Console.WriteLine("Usage:");
        Console.WriteLine("  dotnet run -- generate --type all --count 100");
        Console.WriteLine("  dotnet run -- export --type policies --format csv --from 2025-01-01 --to 2026-12-31");
        Console.WriteLine("  dotnet run -- import --type policies --file policies_import.csv");
    }

    static async Task GenerateTestData(string[] args)
    {
        Console.WriteLine("Generating test data...");
        await Task.CompletedTask;
    }

    static async Task ExportData(string[] args)
    {
        Console.WriteLine("Exporting data...");
        await Task.CompletedTask;
    }

    static async Task ImportData(string[] args)
    {
        Console.WriteLine("Importing data...");
        await Task.CompletedTask;
    }
}
