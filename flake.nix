{
  description = "vrc-knowledge: VitePress docs deployed to Cloudflare Workers";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      devShells = forAllSystems (system:
        let pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              nodejs_22
              pnpm
              wrangler
              git
              gh
            ];

            shellHook = ''
              echo "vrc-knowledge devShell: pnpm dev / pnpm build / wrangler deploy"
            '';
          };
        });
    };
}