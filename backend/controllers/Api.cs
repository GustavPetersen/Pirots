namespace backend.controllers;

using Microsoft.AspNetCore.Mvc;
using backend.engine;

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
