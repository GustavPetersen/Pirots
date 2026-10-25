using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

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

    /// <summary>
    /// Gets starting locations for each prisoner. Site indexed, i.e. location of 
    /// prisoner 0 is at index 0, prisoner 1 at index 1, etc. Assumes square board.
    /// </summary>
    /// <param name="boardSize">The deimensions/side lengths of the board</param>
    /// <returns>A site indexed array of prisoner locations</returns>
    [HttpGet]
    [Route("prisoners")]
    public async Task<IActionResult> GetPrisonerLocations(int boardSize)
    {
        const int nPrisoners = 4;
        HashSet<int> locations = new(nPrisoners);

        for (int i = 0; i < nPrisoners; i++)
        {
            int loc;
            do
            {
                loc = Random.Shared.Next(boardSize * boardSize);
            }
            while (locations.Contains(loc));
            locations.Add(loc);
        }

        return Ok(locations);
    }
    /// <summary>
    /// Simulates a spin with the given bet size returns instructions for frontend
    /// visualization and the payout (not implemented)
    /// </summary>
    /// <param name="bet"> The amount of cash to spin for </param>
    /// <param name="idempotencyKey"> An unique spin identifier to prevent double spins </param>
    /// <returns>Instructions to render the board changes and the final payout (not implemented) </returns>
    [HttpGet]
    [Route("spin")]
    public async Task<IActionResult> SpinReel(int bet, int idempotencyKey)
    {
        SpinResult result = GameEngine.Spin(bet);
        // TODO: DO NOT RUN SPIN WITH SAME KEY
        // TODO: Load Player Wallet
        // TODO: If balance < bet -> Reject bet
        // TODO: set balance = balance - bet
        // TODO: Result = GameEngine.Spin(bet)
        // TODO: Return result
        return Ok(result);
    }
}
