using Microsoft.AspNetCore.Mvc;

/// <summary>
/// Controller for backend API
/// </summary>
[ApiController]
[Route("api")]
[Produces("application/json")]
public class BackendController : ControllerBase
{
    /// <summary>
    /// Constructor deluxe
    /// </summary>
    public BackendController()
    {
    }

    /// <summary>
    /// Returns reels containg random slot symbols
    /// </summary>
    /// <param name="nReels">The number of reels to return</param>
    /// <param name="symbolsPerReel">The number of symbols per reel</param>
    /// <returns>A list reels each encoded as lists of integers</returns>
    [HttpGet]
    [Route("reels")]
    public async Task<IActionResult> GetReels(int nReels, int symbolsPerReel)
    {
        const int nSymbols = 4;

        List<List<int>> reels = new(nReels);
        for (int i = 0; i < nReels; i++)
        {
            List<int> reel = new(symbolsPerReel);
            reels.Add(reel);

            for (int j = 0; j < symbolsPerReel; j++)
            {
                reel.Add(Random.Shared.Next(nSymbols));
            }
        }

        return Ok(reels);
    }
}