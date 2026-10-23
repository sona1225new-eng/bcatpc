import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineAcademicCap, HiOutlineArrowRight, HiOutlineCalendar, HiOutlineDesktopComputer } from 'react-icons/hi';
import { siteConfig } from '../../config/siteConfig';

export default function HeroSection() {
  return (
    <section className="hero-section relative overflow-hidden text-white">
      <div className="hero-media" aria-hidden="true">
        <img
          src="/college-campus.png"
          alt=""
          className="hero-campus-image"
        />
        <div className="hero-image-overlay" />
        <div className="hero-diagonal-divider" />
        <div className="hero-geometry">
          <span />
          <span />
        </div>
      </div>

      <div className="hero-panel">
        <div className="hero-code-background" aria-hidden="true">
          {[22, 30, 26, 24, 28, 32].map((duration, columnIndex) => (
            <div className={`hero-code-column hero-code-column-${columnIndex + 1}`} key={duration}>
              <div
                className="hero-code-track"
                style={{ animationDuration: `${duration}s` }}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7].map((copy) => (
                  <pre className="hero-code-copy" key={copy}><code>
                      <span className="hero-code-comment">// Department of Computer Application</span>{'\n'}
                      <span className="hero-code-keyword">const</span> <span>students</span> = <span className="hero-code-keyword">await</span> <span>learn</span>(<span className="hero-code-string">'computer science'</span>);{'\n'}
                      <span className="hero-code-keyword">function</span> <span>buildSkills</span>(<span>practice</span>) {'{'}{'\n'}
                      {'  '}<span className="hero-code-keyword">return</span> <span>practice</span>.<span>map</span>(<span>concept</span> =&gt; <span>master</span>(<span>concept</span>));{'\n'}
                      {'}'}{'\n'}
                      <span className="hero-code-comment">-- Explore, experiment, and create</span>{'\n'}
                      <span className="hero-code-keyword">SELECT</span> <span>skills</span> <span className="hero-code-keyword">FROM</span> <span>students</span>{'\n'}
                      <span className="hero-code-keyword">WHERE</span> <span>curiosity</span> = <span className="hero-code-string">'true'</span>;{'\n'}
                      <span className="hero-code-keyword">#include</span> <span className="hero-code-string">&lt;stdio.h&gt;</span>{'\n'}
                      <span className="hero-code-keyword">int</span> <span>main</span>() {'{'} <span className="hero-code-keyword">return</span> <span>0</span>; {'}'}{'\n'}
                      <span className="hero-code-keyword">class</span> <span>Student</span> {'{'} <span className="hero-code-keyword">void</span> <span>learn</span>() {'{}'} {'}'}{'\n'}
                      <span className="hero-code-keyword">print</span>(<span className="hero-code-string">"Ideas into code"</span>){'\n'}
                      <span className="hero-code-comment">&lt;!-- Learn by building --&gt;</span>{'\n'}
                  </code></pre>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="hero-layout relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hero-copy">
          <h1 className="hero-heading text-balance font-extrabold tracking-tight text-white leading-[1.08]">
            <span className="hero-heading-line">Welcome To</span>
            <span className="hero-heading-line">Department Of</span>
            <span className="hero-heading-line">Computer Application<span className="hero-cursor" aria-hidden="true" /></span>
          </h1>

          <p className="hero-college-name mt-5 font-semibold tracking-tight text-white">
            {siteConfig.shortCollegeName}, Madhepura
          </p>

          <p className="hero-description mt-4 text-slate-200 leading-relaxed font-normal max-w-xl">
            Welcome to the Department of Computer Application, T.P. College Madhepura (B.N. Mandal University). Our BCA program provides students with a strong foundation in computer science, programming, networking, database technologies, and software engineering. We focus on hands-on practical lab experience, modern IT curriculum, and real-world projects to prepare you for high-growth software careers and premier master's programs.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              to="/academics"
              className="px-6 sm:px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm tracking-wide inline-flex items-center gap-2 shadow-lg shadow-blue-950/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>Explore BCA</span>
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/pyqs"
              className="px-6 sm:px-7 py-3.5 rounded-full bg-transparent hover:bg-white/10 text-white border border-sky-500 hover:border-sky-300 font-bold text-sm inline-flex items-center gap-2 shadow-md transition-all duration-200"
            >
              <span>Browse PYQ</span>
            </Link>
          </div>

          <div className="hero-features" aria-label="Programme features">
            <div className="hero-feature">
              <span className="hero-feature-icon">
                <HiOutlineAcademicCap aria-hidden="true" />
              </span>
              <span>
                <strong>{siteConfig.stats.programYears}-Year</strong>
                <span>Programme</span>
              </span>
            </div>
            <div className="hero-feature">
              <span className="hero-feature-icon">
                <HiOutlineCalendar aria-hidden="true" />
              </span>
              <span>
                <strong>{siteConfig.stats.semesters} Semesters</strong>
                <span>Academic Structure</span>
              </span>
            </div>
            <div className="hero-feature">
              <span className="hero-feature-icon">
                <HiOutlineDesktopComputer aria-hidden="true" />
              </span>
              <span>
                <strong>Practical</strong>
                <span>Learning Approach</span>
              </span>
            </div>
          </div>
          </div>
        </div>

      </div>
    </section>
  );
}
