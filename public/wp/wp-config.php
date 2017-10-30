<?php
$rootDir = dirname(__DIR__, 2);
include($rootDir.'/vendor/vlucas/phpdotenv/src/Loader.php');
include($rootDir.'/vendor/vlucas/phpdotenv/src/Dotenv.php');

$dotenv = new \Dotenv\Dotenv($rootDir);
$dotenv->load();

/**
 * WordPress の基本設定
 *
 * このファイルは、インストール時に wp-config.php 作成ウィザードが利用します。
 * ウィザードを介さずにこのファイルを "wp-config.php" という名前でコピーして
 * 直接編集して値を入力してもかまいません。
 *
 * このファイルは、以下の設定を含みます。
 *
 * * MySQL 設定
 * * 秘密鍵
 * * データベーステーブル接頭辞
 * * ABSPATH
 *
 * @link http://wpdocs.osdn.jp/wp-config.php_%E3%81%AE%E7%B7%A8%E9%9B%86
 *
 * @package WordPress
 */

// 注意:
// Windows の "メモ帳" でこのファイルを編集しないでください !
// 問題なく使えるテキストエディタ
// (http://wpdocs.osdn.jp/%E7%94%A8%E8%AA%9E%E9%9B%86#.E3.83.86.E3.82.AD.E3.82.B9.E3.83.88.E3.82.A8.E3.83.87.E3.82.A3.E3.82.BF 参照)
// を使用し、必ず UTF-8 の BOM なし (UTF-8N) で保存してください。

// ** MySQL 設定 - この情報はホスティング先から入手してください。 ** //
/** WordPress のためのデータベース名 */
define('DB_NAME', getenv('DB_DATABASE'));

/** MySQL データベースのユーザー名 */
define('DB_USER', getenv('DB_USERNAME'));

/** MySQL データベースのパスワード */
define('DB_PASSWORD', getenv('DB_PASSWORD'));

/** MySQL のホスト名 */
define('DB_HOST', getenv('DB_HOST'));

/** データベースのテーブルを作成する際のデータベースの文字セット */
define('DB_CHARSET', getenv('DB_CHARSET'));

/** データベースの照合順序 (ほとんどの場合変更する必要はありません) */
define('DB_COLLATE', getenv('DB_COLLATION'));

/**#@+
 * 認証用ユニークキー
 *
 * それぞれを異なるユニーク (一意) な文字列に変更してください。
 * {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org の秘密鍵サービス} で自動生成することもできます。
 * 後でいつでも変更して、既存のすべての cookie を無効にできます。これにより、すべてのユーザーを強制的に再ログインさせることになります。
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '16vNvM[75.FJES;ADsIWp%e$>-4y&AA<QlP`5l| >#F9[cZA6k,x`WV+oz00ba&9');
define('SECURE_AUTH_KEY',  '6de-@hc(~s0GEUme,]D-H6Ua aGGojV|7g/W1ES^dVAE+v=,jxqvl04g<n~gk4x|');
define('LOGGED_IN_KEY',    '`p/|0Y9a}= QE](T_Bg+,+8`O1snz3VHuk{t b,7n_d?V&I+:(%|{$I!H[]/l,&F');
define('NONCE_KEY',        '_CL$-BE[ }$*9.=HsADHz<zWr_Y3BDp!}ZFizcL9jVJrGmL?8 *rL_07vS?(-}v$');
define('AUTH_SALT',        'nDl>SzV[|2iqor0:x1WI{v4oR*C.Y/_h+h,R,}Ktedkw7{3q|k+$YM/>!t.1n0.H');
define('SECURE_AUTH_SALT', 'z+32AU[ba Wk=O|^rQXe2u<i4%=fD,cW1~;|rF;bC$LrDu(}h/9k<c;-/=+#64d$');
define('LOGGED_IN_SALT',   'W+?Z??S+I%H@siZE@hTB,+T]hCRchWG3FC>>1EQ/|T|^W_Yd^#CNtDTzy2NT_v8Z');
define('NONCE_SALT',       '$I`gMdUVNS`)+V/Z=+}(rGL#IkR2b]8A}sr@WP3kcW-zp`mzWgTlvt,/&>xY-1nf');

/**#@-*/

/**
 * WordPress データベーステーブルの接頭辞
 *
 * それぞれにユニーク (一意) な接頭辞を与えることで一つのデータベースに複数の WordPress を
 * インストールすることができます。半角英数字と下線のみを使用してください。
 */
$table_prefix  = 'wp_';

/**
 * 開発者へ: WordPress デバッグモード
 *
 * この値を true にすると、開発中に注意 (notice) を表示します。
 * テーマおよびプラグインの開発者には、その開発環境においてこの WP_DEBUG を使用することを強く推奨します。
 *
 * その他のデバッグに利用できる定数については Codex をご覧ください。
 *
 * @link http://wpdocs.osdn.jp/WordPress%E3%81%A7%E3%81%AE%E3%83%87%E3%83%90%E3%83%83%E3%82%B0
 */
define('WP_DEBUG', getenv('APP_DEBUG'));

define('WP_HOME', getenv('APP_URL'));
define('WP_SITEURL', getenv('APP_URL').'/wp');

/* 編集が必要なのはここまでです ! WordPress でブログをお楽しみください。 */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
