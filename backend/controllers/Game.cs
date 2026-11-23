namespace backend.controllers;

using Microsoft.AspNetCore.Mvc;
using backend.engine;
using backend.dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using backend.data;
using Microsoft.EntityFrameworkCore;

/// <summary>
/// Controller for game requests
/// </summary>
[ApiController]
[Route("game")]
[Produces("application/json")]
public class GameController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly AppDbContext _dbContext;

    /// <summary>
    /// Constructor deluxe
    /// </summary>
    /// 
    public GameController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, AppDbContext dbContext)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _dbContext = dbContext;
    }

    /// <summary>
    /// Simulates a spin with the given bet size returns instructions for frontend
    /// visualization and the payout (not implemented)
    /// </summary>
    /// <param name="req"> ... </param>
    /// <returns>Instructions to render the board changes and the final payout (not implemented) </returns>
    [Authorize]
    [HttpPost]
    [Route("spin")]
    public async Task<IActionResult> SpinReel(SpinRequest req)
    {
        // TODO: DO NOT RUN SPIN WITH SAME KEY
        string? userId = _userManager.GetUserId(User);
        Wallet? wallet = await _dbContext.Wallets.SingleOrDefaultAsync(w => w.UserId == userId);
        if (wallet is null)
        {
            await _signInManager.SignOutAsync();
            return Unauthorized();
        }

        if (wallet.Amount - req.Bet < 0)
        {
            return Conflict();
        }

        SpinResult result = GameEngine.Spin(req.Bet);

        decimal payout = result.PrisonerWalks.SelectMany(walk => walk).Sum(step => step.Payout);
        wallet.Amount += payout - req.Bet;
        await _dbContext.SaveChangesAsync();

        return Ok(result);
    }
}
