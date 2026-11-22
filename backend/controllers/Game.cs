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
    /// <param name="bet"> The amount of cash to spin for </param>
    /// <param name="idempotencyKey"> An unique spin identifier to prevent double spins </param>
    /// <returns>Instructions to render the board changes and the final payout (not implemented) </returns>
    [Authorize]
    [HttpGet]
    [Route("spin")]
    public async Task<IActionResult> SpinReel(int bet, int idempotencyKey)
    {
        // TODO: DO NOT RUN SPIN WITH SAME KEY
        AppUser? curUser = await _userManager.GetUserAsync(User);
        if (curUser is null)
        {
            await _signInManager.SignOutAsync();
            return Unauthorized();
        }

        Wallet wallet = _dbContext.Wallets.First(wallet => wallet.UserId == curUser.Id);
        if (wallet.Amount - bet < 0)
        {
            return Forbid();
        }

        SpinResult result = GameEngine.Spin(bet);

        float payout = (float)result.PrisonerWalks.SelectMany(stepList => stepList).Sum(step => step.Payout);
        wallet.Amount += payout - bet;
        await _dbContext.SaveChangesAsync();

        return Ok(result);
    }
}
